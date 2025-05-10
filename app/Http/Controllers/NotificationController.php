<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = $request->user();
        $notifications = $user->notifications()
            ->latest()
            ->paginate(15);
        
        return response()->json($notifications);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $notification->read = true;
        $notification->save();
        
        return response()->json([
            'message' => 'Notification marquée comme lue',
            'notification' => $notification
        ]);
    }

   

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        
        $user->notifications()->update(['read' => true]);
        
        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues'
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Notification $notification)
    {
        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        
        $notification->delete();
        
        return response()->json([
            'message' => 'Notification supprimée avec succès'
        ]);
    }
}
