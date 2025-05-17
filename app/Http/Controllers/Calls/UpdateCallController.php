<?php

namespace App\Http\Controllers\Calls;

use App\Models\Call;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UpdateCallController extends Controller
{
    public function update(Request $request, Call $call)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'duration' => 'nullable|integer',
            'notes' => 'nullable|string'
        ]);

        $call->update($validated);

        return back()->with('success', 'Call updated successfully.');
    }
} 