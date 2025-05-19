<?php

namespace App\Http\Controllers\Calls;


use App\Http\Controllers\Controller;
use App\Models\Call;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UpdateCallController extends Controller
{
    public function update(Request $request, Call $call)
    {
        $validated = $request->validate([
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'duration' => 'nullable|numeric',
            'user_id' => 'nullable|exists:users,id',
        ]);
        
        if ($request->status === 'active') {
            // Get the user associated with this call
            $userId = $call->user_id;
            // Update all active calls for this user to on-hold, except the current call
            Call::where('user_id', $userId)
                ->where('status', 'active')
                ->where('id', '!=', $call->id)
                ->update(['status' => 'on-hold']);
        }

        $call->update($validated);

        return back()->with('success', 'Call updated successfully.');
    }
} 