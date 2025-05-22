<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Notification; // Add your custom notification model
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\TicketAssigned;

class UpdateTicketController extends Controller
{
    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        // Vérification des autorisations pour les agents
        if ($user->isAgent() && $ticket->created_by !== $user->id && $ticket->assigned_to !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $validated = $request->validate([
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:open,in-progress,resolved,closed',
            'assigned_to' => 'nullable|exists:users,id',
        ]);
        
        $oldStatus = $ticket->status;
        $oldAssignee = $ticket->assigned_to;
        
        $ticket->update($validated);

        // Si le statut a changé en "résolu", envoyer une notification/email
        if ($oldStatus !== 'resolved' && $ticket->status === 'resolved') {
            // Save resolved notification to your custom notifications table
            if ($ticket->assigned_to) {
                Notification::create([
                    'user_id' => $ticket->assigned_to,
                    'title' => 'Ticket Resolved',
                    'message' => "Ticket '{$ticket->subject}' has been marked as resolved.",
                    'type' => 'ticket_resolved',
                    'related_type' => 'ticket',
                    'related_id' => $ticket->id,
                    'read' => false,
                ]);
            }
        }

        // Si l'assignation a changé, envoyer une notification/email
        if ($oldAssignee !== $ticket->assigned_to && $ticket->assigned_to) {
            $assigned_to_user = User::find($ticket->assigned_to);
            if ($assigned_to_user) {
                // Send email notification
                $assigned_to_user->notify(new TicketAssigned($ticket));
                
                // Save to your custom notifications table
                Notification::create([
                    'user_id' => $ticket->assigned_to,
                    'title' => 'New Ticket Assigned',
                    'message' => "You have been assigned to ticket: '{$ticket->subject}'",
                    'type' => 'ticket_assigned',
                    'related_type' => 'ticket',
                    'related_id' => $ticket->id,
                    'read' => false,
                ]);
            }
        }

        return back()->with('success', 'Ticket updated successfully.');
    }
}