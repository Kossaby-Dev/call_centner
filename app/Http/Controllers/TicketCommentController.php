<?php

namespace App\Http\Controllers;

use App\Models\TicketComment;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = TicketComment::all();
        return response()->json($comments);
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
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'user_id' => 'required|exists:users,id',
            'comment' => 'required|string',
        ]);

        $comment = TicketComment::create($request->all());

        return response()->json($comment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketComment $ticketComment)
    {
        $comment = TicketComment::findOrFail($ticketComment->id);
        return response()->json($comment);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TicketComment $ticketComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TicketComment $ticketComment)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'user_id' => 'required|exists:users,id',
            'comment' => 'required|string',
        ]);

        $comment = TicketComment::findOrFail($ticketComment->id);
        $comment->update($request->all());

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketComment $ticketComment)
    {
        $comment = TicketComment::findOrFail($ticketComment->id);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
