<?php

namespace App\Http\Controllers;

use App\Models\Call;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function overview()
    {
        $user = auth()->user();
        $isSupervisor = $user->role === 'supervisor';

        if ($isSupervisor) {
            // Get team KPIs
            $teamKPIs = [
                'totalCalls' => Call::whereDate('created_at', today())->count(),
                'avgWaitTime' => $this->formatTime(Call::whereDate('created_at', today())->avg('wait_time') ?? 0),
                'openTickets' => Ticket::where('status', 'open')->count(),
                'agentsActive' => User::where('role', 'agent')
                    ->where('status', 'online')
                    ->count(),
            ];

            // Get agent statuses
            $agents = User::where('role', 'agent')
                ->select('id', 'name', 'status')
                ->withCount(['calls' => function ($query) {
                    $query->whereDate('created_at', today());
                }])
                ->withCount(['tickets' => function ($query) {
                    $query->where('status', 'open');
                }])
                ->get();

            return Inertia::render('dashboard/overview', [
                'userRole' => 'supervisor',
                'teamKPIs' => $teamKPIs,
                'agents' => $agents,
            ]);
        } else {
            // Get agent KPIs
            $agentKPIs = [
                'callsHandled' => $user->calls()
                    ->whereDate('created_at', today())
                    ->count(),
                'avgCallTime' => $this->formatTime($user->calls()
                    ->whereDate('created_at', today())
                    ->avg('duration') ?? 0),
                'ticketsResolved' => $user->assignedTickets()
                    ->whereDate('resolved_at', today())
                    ->count(),
                'satisfaction' => $user->calls()
                    ->whereDate('created_at', today())
                    ->avg('satisfaction_rating') ?? 0,
            ];

            return Inertia::render('dashboard/overview', [
                'userRole' => 'agent',
                'agentKPIs' => $agentKPIs,
            ]);
        }
    }

    private function formatTime($minutes)
    {
        if (!$minutes) return '0:00';
        
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        
        return sprintf('%d:%02d', $hours, $mins);
    }
} 