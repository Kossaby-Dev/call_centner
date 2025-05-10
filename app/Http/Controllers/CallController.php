<?php

namespace App\Http\Controllers;

use App\Models\Call;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CallController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Si c'est un superviseur, il peut voir tous les appels
        if ($user->isSupervisor()) {
            $calls = Call::with('user')->latest()->paginate(15);
        } 
        // Si c'est un agent, il ne voit que ses propres appels
        else {
            $calls = Call::where('user_id', $user->id)->latest()->paginate(15);
        }
        
        return response()->json($calls);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'call_time' => 'required|date',
            'duration' => 'required|integer',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:255',
            'subject' => 'required|string',
            'notes' => 'nullable|string',
            'call_type' => 'required|in:entrant,sortant',
        ]);

        $call = new Call($validated);
        $call->user_id = $request->user()->id;
        $call->save();

        // Notification pour les superviseurs
        if ($request->user()->isAgent()) {
            $this->notificationService->notifySupervisorsNewCall($call);
        }

        return response()->json([
            'message' => 'Appel enregistré avec succès',
            'call' => $call
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Call $call)
    {
        $user = $request->user();
        
        // Vérification des autorisations
        if ($user->isAgent() && $call->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        return response()->json($call->load('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Call $call)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Call $call)
    {
        $user = $request->user();
        
        // Vérification des autorisations
        if ($user->isAgent() && $call->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $validated = $request->validate([
            'call_time' => 'sometimes|date',
            'duration' => 'sometimes|integer',
            'client_name' => 'sometimes|string|max:255',
            'client_phone' => 'sometimes|string|max:20',
            'subject' => 'sometimes|string',
            'notes' => 'nullable|string',
            'call_type' => 'sometimes|in:entrant,sortant',
        ]);
        
        $call->update($validated);
        
        return response()->json([
            'message' => 'Appel mis à jour avec succès',
            'call' => $call
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Call $call)
    {
        $user = $request->user();
        
        // Seuls les superviseurs ou l'agent qui a créé l'appel peuvent le supprimer
        if ($user->isAgent() && $call->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $call->delete();
        
        return response()->json([
            'message' => 'Appel supprimé avec succès'
        ]);
    }
}
