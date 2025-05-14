<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'overview'])->name('dashboard');
    Route::get('dashboard/tickets', function () {
        return Inertia::render('dashboard/tickets');
    })->name('tickets');

    Route::get('dashboard/calls', function () {
        return Inertia::render('dashboard/calls');
    })->name('calls');

    Route::get('dashboard/agents', function () {
        return Inertia::render('dashboard/agents');
    })->name('agents');
});
