<?php

use App\Http\Controllers\CallsController;
use App\Http\Controllers\TicketsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'overview'])->name('dashboard');
    // Route::get('dashboard/tickets', function () {
    //     return Inertia::render('dashboard/tickets');
    // })->name('tickets');

    // Calls routes
    Route::get('dashboard/calls', [CallsController::class, 'index'])->name('calls');
    Route::post('dashboard/calls', [CallsController::class, 'store'])->name('calls.store');
    Route::put('dashboard/calls/{call}', [CallsController::class, 'update'])->name('calls.update');
    Route::delete('dashboard/calls/{call}', [CallsController::class, 'destroy'])->name('calls.destroy');


    // Tickets routes
    Route::get('dashboard/tickets', [TicketsController::class, 'index'])->name('tickets');
    Route::post('dashboard/tickets', [TicketsController::class, 'store'])->name('tickets.store');
    Route::put('dashboard/tickets/{ticket}', [TicketsController::class, 'update'])->name('tickets.update');
    Route::delete('dashboard/tickets/{ticket}', [TicketsController::class, 'destroy'])->name('tickets.destroy');

    Route::get('dashboard/agents', function () {
        return Inertia::render('dashboard/agents');
    })->name('agents');
});
