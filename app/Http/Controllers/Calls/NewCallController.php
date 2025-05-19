<?php

namespace App\Http\Controllers\Calls;

use App\Http\Controllers\Controller;
use App\Models\Call;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewCallController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'subject' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'call_time' => 'required|date',
            'status' => 'required|string',
        ]);

        $user = auth()->user();

        // Add the user_id from the authenticated user
        $validated['user_id'] = $user->id;

        $call = Call::create($validated);

        return back()->with('success', 'Call recorded successfully.');
    }
} 