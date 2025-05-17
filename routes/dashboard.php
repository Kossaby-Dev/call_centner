<?php

use App\Http\Controllers\DashboardController;

use App\Http\Controllers\Calls\GetCallsController;
use App\Http\Controllers\Calls\NewCallController;
use App\Http\Controllers\Calls\UpdateCallController;
use App\Http\Controllers\Calls\DeleteCallController;


use App\Http\Controllers\Tickets\GetTicketsController;
use App\Http\Controllers\Tickets\AddTicketController;
use App\Http\Controllers\Tickets\UpdateTicketController;
use App\Http\Controllers\Tickets\DeleteTicketController;
use App\Http\Controllers\Tickets\TicketCommentController;

use App\Http\Controllers\Notifications\NotificationController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'overview'])->name('dashboard');
    // Calls routes
    Route::get('dashboard/calls', [GetCallsController::class, 'index'])->name('calls');
    Route::post('dashboard/calls', [NewCallController::class, 'store'])->name('calls.store');
    Route::put('dashboard/calls/{call}', [UpdateCallController::class, 'update'])->name('calls.update');
    Route::delete('dashboard/calls/{call}', [DeleteCallController::class, 'destroy'])->name('calls.destroy');


    // Tickets routes
    Route::get('dashboard/tickets', [GetTicketsController::class, 'index'])->name('tickets');
    Route::post('dashboard/tickets', [AddTicketController::class, 'store'])->name('tickets.store');
    Route::put('dashboard/tickets/{ticket}', [UpdateTicketController::class, 'update'])->name('tickets.update');
    Route::delete('dashboard/tickets/{ticket}', [DeleteTicketController::class, 'destroy'])->name('tickets.destroy');


    // Tickets Comment routes
    Route::get('dashboard/tickets/{ticket}/comments', [TicketCommentController::class, 'index'])->name('comments.index');
    Route::post('dashboard/tickets/{ticket}/comments', [TicketCommentController::class, 'store'])->name('comments.store');
    Route::post('dashboard/tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'show'])->name('comments.show');
    Route::put('dashboard/tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'update'])->name('comments.update');
    Route::delete('dashboard/tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'destroy'])->name('comments.destroy');

     // Notifications routes
     Route::get('dashboard/notifications', [NotificationController::class, 'index'])->name('notifications');
     Route::post('dashboard/notifications/{notification}', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
     Route::put('dashboard/notifications', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
     Route::delete('dashboard/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    Route::get('dashboard/agents', function () {
        return Inertia::render('dashboard/agents');
    })->name('agents');
});
