<?php

namespace App\Http\Controllers\Tickets;

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
            $tickets = Ticket::with(['creator', 'assignee'])->latest()->paginate(15);
            return Inertia::render('dashboard/tickets', [
                'userRole' => 'supervisor',
                'tickets' => $tickets,
            ]);
        } else {
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
} 