<?php

namespace App\Http\Controllers;

use App\Models\Call;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CallsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSupervisor = $user->role === 'supervisor';

        if ($isSupervisor) {
            // Get all calls with related data for supervisors
            $calls = Call::with(['agent'])
                ->latest()
                ->paginate(10);

            // Get active agents for filtering
            $agents = User::where('role', 'agent')
                ->where('status', 'online')
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'call_type' => 'required|in:entrant,sortant',
            'subject' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'call_time' => 'required|date',
            'status' => 'required|string',
        ]);

        $user = auth()->user();

        // Add the user_id from the authenticated user
        $validated['user_id'] = $user->id;
        $validated['duration'] = 55;

        $call = Call::create($validated);

        return back()->with('success', 'Call recorded successfully.');
    }

    public function update(Request $request, Call $call)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'duration' => 'nullable|integer',
            'notes' => 'nullable|string',
            'satisfaction_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $call->update($validated);

        return back()->with('success', 'Call updated successfully.');
    }

    public function destroy(Call $call)
    {
        $call->delete();
        return back()->with('success', 'Call deleted successfully.');
    }
} 