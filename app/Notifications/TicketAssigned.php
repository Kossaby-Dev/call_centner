<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Ticket;

class TicketAssigned extends Notification
{
    use Queueable;

    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail']; // Keep only mail since we'll handle database manually
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Ticket Assigned to You')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('A new ticket has been assigned to you.')
            ->line('**Ticket Details:**')
            ->line('Subject: ' . $this->ticket->subject)
            ->line('Priority: ' . ucfirst($this->ticket->priority))
            ->line('Status: ' . ucfirst($this->ticket->status))
            ->action('View Ticket', url('/tickets/' . $this->ticket->id))
            ->line('Please review and take appropriate action.')
            ->salutation('Best regards, Support Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_subject' => $this->ticket->subject,
            'ticket_priority' => $this->ticket->priority,
            'message' => 'You have been assigned to ticket: ' . $this->ticket->subject
        ];
    }
}