@component('mail::message')
# Ticket Assigné

Bonjour {{ $ticket->assignee->name }},

Un ticket vous a été assigné pour suivi.

**Détails du ticket :**
- **Numéro :** {{ $ticket->ticket_number }}
- **Client :** {{ $ticket->client_name }}
- **Sujet :** {{ $ticket->subject }}
- **Priorité :** {{ ucfirst($ticket->priority) }}

**Description :**
{{ $ticket->description }}

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id])
Voir le ticket
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent

<!-- resources/views/emails/tickets/resolved.blade.php -->
@component('mail::message')
# Ticket Résolu

Bonjour,

Le ticket suivant a été marqué comme résolu :

**Détails du ticket :**
- **Numéro :** {{ $ticket->ticket_number }}
- **Client :** {{ $ticket->client_name }}
- **Sujet :** {{ $ticket->subject }}
- **Résolu par :** {{ $ticket->assignee ? $ticket->assignee->name : $ticket->creator->name }}

Si vous avez des questions ou si le problème persiste, n'hésitez pas à rouvrir le ticket.

@component('mail::button', ['url' => config('app.url') . '/tickets/' . $ticket->id])
Voir le ticket
@endcomponent

Merci,<br>
{{ config('app.name') }}
@endcomponent