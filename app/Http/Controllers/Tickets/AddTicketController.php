<?php

namespace App\Http\Controllers\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddTicketController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'call_id' => 'nullable|exists:calls,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = new Ticket($validated);
        $ticket->created_by = $request->user()->id;
        $ticket->status = 'open';
        $ticket->save();

        // Envoi d'email si un agent est assigné au ticket
        if ($ticket->assigned_to) {
            $this->emailService->sendTicketAssignedEmail($ticket);
        }

        // Notification pour les superviseurs
        $this->notificationService->notifySupervisorsNewTicket($ticket);

        return back()->with('success', 'Ticket recorded successfully.');
    }
} 