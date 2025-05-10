<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'call_id',
        'created_by',
        'assigned_to',
        'client_name',
        'client_phone',
        'subject',
        'description',
        'priority',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Generate ticket number before creating
        static::creating(function ($ticket) {
            $ticket->ticket_number = 'TIC-' . time() . '-' . rand(1000, 9999);
        });
    }

    public function call()
    {
        return $this->belongsTo(Call::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(TicketComment::class);
    }
}
