<?php

namespace App\Http\Controllers\Calls;

use App\Http\Controllers\Controller;
use App\Models\Call;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GetCallsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSupervisor = $user->role === 'supervisor';

        if ($user->isSupervisor()) {
            // Get all calls with related data for supervisors
            $calls = Call::with(['user'])
                ->latest()
                ->paginate(10);

            // Get active agents for filtering
            $agents = User::where('role', 'agent')
                ->get(['id', 'name']);

            return Inertia::render('dashboard/calls', [
                'userRole' => 'supervisor',
                'calls' => $calls,
                'agents' => $agents,
            ]);
        } else {
            // Get only the agent's calls
            $calls = $user->calls()
                ->latest()
                ->paginate(10);
                
            return Inertia::render('dashboard/calls', [
                'userRole' => 'agent',
                'calls' => $calls,
            ]);
        }
    }
} 