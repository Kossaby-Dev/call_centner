<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Services\EmailService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected $emailService;
    protected $notificationService;

    public function __construct(EmailService $emailService, NotificationService $notificationService)
    {
        $this->emailService = $emailService;
        $this->notificationService = $notificationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = $request->user();
        
        // Si c'est un superviseur, il peut voir tous les tickets
        if ($user->isSupervisor()) {
            $tickets = Ticket::with(['creator', 'assignee'])->latest()->paginate(15);
        } 
        // Si c'est un agent, il ne voit que les tickets qu'il a créés ou qui lui sont assignés
        else {
            $tickets = Ticket::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->with(['creator', 'assignee'])
                ->latest()
                ->paginate(15);
        }
        
        return response()->json($tickets);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
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

        return response()->json([
            'message' => 'Ticket créé avec succès',
            'ticket' => $ticket->load(['creator', 'assignee'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $user = $request->user();
        
        // Vérification des autorisations pour les agents
        if ($user->isAgent() && $ticket->created_by !== $user->id && $ticket->assigned_to !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        return response()->json($ticket->load(['creator', 'assignee', 'comments.user']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
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
        
        return response()->json([
            'message' => 'Ticket mis à jour avec succès',
            'ticket' => $ticket->load(['creator', 'assignee'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $user = $request->user();
        
        // Seuls les superviseurs ou l'agent qui a créé le ticket peuvent le supprimer
        if ($user->isAgent() && $ticket->created_by !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $ticket->delete();
        
        return response()->json([
            'message' => 'Ticket supprimé avec succès'
        ]);
    }

    /**
     * Add a comment to a ticket.
     */
    public function addComment(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        // Vérification des autorisations pour les agents
        if ($user->isAgent() && $ticket->created_by !== $user->id && $ticket->assigned_to !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $validated = $request->validate([
            'comment' => 'required|string',
        ]);
        
        $comment = new TicketComment([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'comment' => $validated['comment'],
        ]);
        
        $comment->save();

        // Notifier les personnes concernées
        $this->notificationService->notifyTicketComment($comment);
        
        return response()->json([
            'message' => 'Commentaire ajouté avec succès',
            'comment' => $comment->load('user')
        ], 201);
    }
}
