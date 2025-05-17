<?php

namespace App\Http\Controllers\Calls;

use App\Models\Call;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeleteCallController extends Controller
{
    public function destroy(Call $call)
    {
        $call->delete();
        return back()->with('success', 'Call deleted successfully.');
    }
} 