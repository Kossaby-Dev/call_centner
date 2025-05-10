<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketAssigned;
use App\Mail\TicketResolved;

class EmailService
{
    /**
     * Envoyer un email lorsqu'un ticket est assigné à un agent
     */
    public function sendTicketAssignedEmail(Ticket $ticket)
    {
        if (!$ticket->assignee) {
            return;
        }
        
        Mail::to($ticket->assignee->email)->send(new TicketAssigned($ticket));
    }
    
    /**
     * Envoyer un email lorsqu'un ticket est résolu
     */
    public function sendTicketResolvedEmail(Ticket $ticket)
    {
        // Notifier le créateur du ticket
        Mail::to($ticket->creator->email)->send(new TicketResolved($ticket));
        
        // Notifier l'agent assigné s'il est différent du créateur
        if ($ticket->assignee && $ticket->assignee->id !== $ticket->created_by) {
            Mail::to($ticket->assignee->email)->send(new TicketResolved($ticket));
        }
    }
}
