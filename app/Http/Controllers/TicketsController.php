<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSupervisor = $user->role === 'supervisor';

        if ($user->isSupervisor()) {
            $tickets = Ticket::with(['creator', 'assignee'])->latest()->paginate(15);
            return Inertia::render('dashboard/tickets', [
                'userRole' => 'supervisor',
                'tickets' => $tickets,
            ]);
        } 
        // Si c'est un agent, il ne voit que les tickets qu'il a créés ou qui lui sont assignés
        else {
            $tickets = Ticket::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->with(['creator', 'assignee'])
                ->latest()
                ->paginate(15);
                return Inertia::render('dashboard/tickets', [
                    'userRole' => 'agent',
                    'tickets' => $tickets,
                ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'call_id' => 'nullable|exists:calls,id',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:basse,moyenne,haute,critique',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $ticket = new Ticket($validated);
        $ticket->created_by = $request->user()->id;
        $ticket->status = 'nouveau';
        $ticket->save();

        // Envoi d'email si un agent est assigné au ticket
        if ($ticket->assigned_to) {
            $this->emailService->sendTicketAssignedEmail($ticket);
        }

        // Notification pour les superviseurs
        $this->notificationService->notifySupervisorsNewTicket($ticket);

        return back()->with('success', 'Call recorded successfully.');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        // Vérification des autorisations pour les agents
        if ($user->isAgent() && $ticket->created_by !== $user->id && $ticket->assigned_to !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $validated = $request->validate([
            'client_name' => 'sometimes|string|max:255',
            'client_phone' => 'sometimes|string|max:20',
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:basse,moyenne,haute,critique',
            'status' => 'sometimes|in:nouveau,en_cours,en_attente,résolu,fermé',
            'assigned_to' => 'nullable|exists:users,id',
        ]);
        
        $oldStatus = $ticket->status;
        $oldAssignee = $ticket->assigned_to;
        
        $ticket->update($validated);

        // Si le statut a changé en "résolu", envoyer une notification/email
        if ($oldStatus !== 'résolu' && $ticket->status === 'résolu') {
            $this->emailService->sendTicketResolvedEmail($ticket);
            $this->notificationService->notifyTicketResolved($ticket);
        }

        // Si l'assignation a changé, envoyer une notification/email
        if ($oldAssignee !== $ticket->assigned_to && $ticket->assigned_to) {
            $this->emailService->sendTicketAssignedEmail($ticket);
            $this->notificationService->notifyTicketAssigned($ticket);
        }

        return back()->with('success', 'Ticket updated successfully.');
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return back()->with('success', 'Ticket deleted successfully.');
    }
} 