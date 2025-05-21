<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
          //  $this->emailService->sendTicketResolvedEmail($ticket);
            $this->notificationService->notifyTicketResolved($ticket);
        }

        // Si l'assignation a changé, envoyer une notification/email
        if ($oldAssignee !== $ticket->assigned_to && $ticket->assigned_to) {
           // $this->emailService->sendTicketAssignedEmail($ticket);
            $this->notificationService->notifyTicketAssigned($ticket);
        }

        return back()->with('success', 'Ticket updated successfully.');
    }
} 