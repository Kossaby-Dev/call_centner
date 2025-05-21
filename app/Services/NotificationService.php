<?php

namespace App\Services;


use App\Models\Call;
use App\Models\Notification;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Support\Facades\Event;

class NotificationService
{
    /**
     * Notifier les superviseurs d'un nouvel appel
     */
    public function notifySupervisorsNewCall(Call $call)
    {
        $supervisors = User::where('role', 'supervisor')->get();
        
        foreach ($supervisors as $supervisor) {
            $notification = new Notification([
                'user_id' => $supervisor->id,
                'title' => 'Nouvel appel enregistré',
                'message' => "Un nouvel appel a été enregistré par {$call->user->name} avec le client {$call->client_name}.",
                'type' => 'info',
                'related_type' => 'call',
                'related_id' => $call->id,
            ]);
            
            $notification->save();
            //$this->broadcastNotification($notification);
        }
    }

    /**
     * Notifier les superviseurs d'un nouveau ticket
     */
    public function notifySupervisorsNewTicket(Ticket $ticket)
    {
        $supervisors = User::where('role', 'supervisor')->get();
        
        foreach ($supervisors as $supervisor) {
            $notification = new Notification([
                'user_id' => $supervisor->id,
                'title' => 'Nouveau ticket créé',
                'message' => "Un nouveau ticket #{$ticket->ticket_number} a été créé par {$ticket->creator->name} concernant {$ticket->subject}.",
                'type' => 'info',
                'related_type' => 'ticket',
                'related_id' => $ticket->id,
            ]);
            
            $notification->save();
          //  $this->broadcastNotification($notification);
        }
    }

    /**
     * Notifier quand un ticket est résolu
     */
    public function notifyTicketResolved(Ticket $ticket)
    {
        // Notifier le créateur si ce n'est pas lui qui l'a résolu
        if ($ticket->created_by !== auth()->id()) {
            $notification = new Notification([
                'user_id' => $ticket->created_by,
                'title' => 'Ticket résolu',
                'message' => "Le ticket #{$ticket->ticket_number} concernant {$ticket->subject} a été marqué comme résolu.",
                'type' => 'success',
                'related_type' => 'ticket',
                'related_id' => $ticket->id,
            ]);
            
            $notification->save();
            $this->broadcastNotification($notification);
        }
        
        // Notifier l'assigné si ce n'est pas lui qui l'a résolu et s'il est différent du créateur
        if ($ticket->assigned_to && 
            $ticket->assigned_to !== auth()->id() && 
            $ticket->assigned_to !== $ticket->created_by) {
            $notification = new Notification([
                'user_id' => $ticket->assigned_to,
                'title' => 'Ticket résolu',
                'message' => "Le ticket #{$ticket->ticket_number} concernant {$ticket->subject} a été marqué comme résolu.",
                'type' => 'success',
                'related_type' => 'ticket',
                'related_id' => $ticket->id,
            ]);
            
            $notification->save();
            $this->broadcastNotification($notification);
        }
    }

    /**
     * Notifier quand un ticket est assigné
     */
    public function notifyTicketAssigned(Ticket $ticket)
    {
        if (!$ticket->assignee) {
            return;
        }
        
        $notification = new Notification([
            'user_id' => $ticket->assigned_to,
            'title' => 'Ticket assigné',
            'message' => "Le ticket #{$ticket->ticket_number} concernant {$ticket->subject} vous a été assigné.",
            'type' => 'info',
            'related_type' => 'ticket',
            'related_id' => $ticket->id,
        ]);
        
        $notification->save();
       // $this->broadcastNotification($notification);
    }

    /**
     * Notifier d'un commentaire sur un ticket
     */
    public function notifyTicketComment(TicketComment $comment)
    {
        $ticket = $comment->ticket;
        $commenter = $comment->user;
        
        // Les personnes à notifier (créateur et assigné, sauf celui qui commente)
        $notifyUsers = [];
        
        if ($ticket->created_by !== $commenter->id) {
            $notifyUsers[] = $ticket->creator;
        }
        
        if ($ticket->assigned_to && $ticket->assigned_to !== $commenter->id && $ticket->assigned_to !== $ticket->created_by) {
            $notifyUsers[] = $ticket->assignee;
        }
        
        foreach ($notifyUsers as $user) {
            $notification = new Notification([
                'user_id' => $user->id,
                'title' => 'Nouveau commentaire sur un ticket',
                'message' => "{$commenter->name} a commenté sur le ticket #{$ticket->ticket_number} concernant {$ticket->subject}.",
                'type' => 'info',
                'related_type' => 'ticket',
                'related_id' => $ticket->id,
            ]);
            
            $notification->save();
          //  $this->broadcastNotification($notification);
        }
    }

    /**
     * Diffuser la notification en temps réel
     */
    protected function broadcastNotification(Notification $notification)
    {
        // Utilisation des événements Laravel pour la diffusion en temps réel
        // Cela pourrait être intégré avec Laravel Echo et Pusher par exemple
        Event::dispatch('notification.created', $notification);
    }
}
