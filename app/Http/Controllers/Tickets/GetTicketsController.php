<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GetTicketsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->isSupervisor()) {
            $tickets = Ticket::with(['creator', 'assignee', 'call', 'comments.user'])->latest()->paginate(15);
             // Get active agents for filtering
             $agents = User::where('role', 'agent')
             ->get(['id', 'name']);

            return Inertia::render('dashboard/tickets', [
                'userRole' => 'supervisor',
                'tickets' => $tickets,
                'agents' => $agents,
            ]);
        } else {
            $tickets = Ticket::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->with(['creator', 'assignee', 'call', 'comments.user'])
                ->latest()
                ->paginate(15);

                $agents = User::where('role', 'agent')
                ->get(['id', 'name']);

                return Inertia::render('dashboard/tickets', [
                    'userRole' => 'agent',
                    'tickets' => $tickets,
                    'agents' => $agents,
                ]);
        }
    }
} 