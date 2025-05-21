<?php

namespace App\Http\Controllers\Tickets;


use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketComment;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Ticket $ticket)
    {
        $comments = $ticket->comments()->get();
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'comment' => 'required|string',
        ]);

        $comment = $ticket->comments()->create([
            'user_id' => $request->user_id,
            'comment' => $request->comment
        ]);

        return back()->with('success', 'Comment recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket, TicketComment $comment)
    {
        // Ensure the comment belongs to the ticket
        if ($comment->ticket_id !== $ticket->id) {
            return response()->json(['message' => 'Comment not found for this ticket'], 404);
        }

        return response()->json($comment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket, TicketComment $comment)
    {
        // Ensure the comment belongs to the ticket
        if ($comment->ticket_id !== $ticket->id) {
            return response()->json(['message' => 'Comment not found for this ticket'], 404);
        }

        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'comment' => 'sometimes|required|string',
        ]);

        $comment->update($request->only(['user_id', 'comment']));

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket, TicketComment $comment)
    {
        // Ensure the comment belongs to the ticket
        if ($comment->ticket_id !== $ticket->id) {
            return response()->json(['message' => 'Comment not found for this ticket'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}