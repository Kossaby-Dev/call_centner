<?php

namespace App\Http\Controllers;
use App\Services\EmailService;
use App\Services\NotificationService;

abstract class Controller
{
    protected $emailService;
    protected $notificationService;

    public function __construct(EmailService $emailService = null, NotificationService $notificationService = null)
    {
        $this->emailService = $emailService;
        $this->notificationService = $notificationService;
    }
    
}