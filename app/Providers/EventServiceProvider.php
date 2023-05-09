<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Listeners\LogUserEvent;
use App\Listeners\LogGameEvent;
use App\Listeners\LogModelEvent;
use App\Listeners\LogEvent;
use App\Models\User;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        \App\Events\UserJoinedGame::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserJoinedGame::class,
        ],
        \App\Events\UserLeftGame::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserLeftGame::class,
        ],
        \App\Events\UserDisconnected::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserDisconnected::class,
        ],
        \App\Events\UserConnected::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserConnected::class,
        ],
        \App\Events\UserBeganWaiting::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserBeganWaiting::class,
        ],
        \App\Events\UserBeganPlaying::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserBeganPlaying::class,
        ],
        \App\Events\UserBeganSpectating::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserBeganSpectating::class,
        ],
        \App\Events\UserStoppedPlaying::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserStoppedPlaying::class,
        ],
        \App\Events\UserVoted::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserVoted::class,
        ],
        \App\Events\UserBecameReady::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserBecameReady::class,
        ],
        \App\Events\UserBecameUnready::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserBecameUnready::class,
        ],
        \App\Events\UserWonGame::class => [
            LogUserEvent::class,
            \App\Listeners\HandleUserWonGame::class,
        ],

        \App\Events\GameProgressed::class => [
            LogGameEvent::class,
            \App\Listeners\HandleGameProgressed::class,
        ],
        \App\Events\GameQuestionerChanged::class => [
            LogGameEvent::class,
            \App\Listeners\HandleGameQuestionerChanged::class,
        ],
        \App\Events\GameQuestionerStoppedPlaying::class => [
            LogGameEvent::class,
            \App\Listeners\HandleGameQuestionerStoppedPlaying::class,
        ],
        \App\Events\GameOwnerChanged::class => [
            LogGameEvent::class,
            \App\Listeners\HandleGameOwnerChanged::class,
        ],

        \App\Events\UserQuestionCardDrawn::class => [
            LogModelEvent::class,
            \App\Listeners\HandleQuestionCardDrawn::class,
        ],
        \App\Events\UserQuestionCardPlayed::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserQuestionCardPlayed::class,
        ],
        \App\Events\UserQuestionCardTrashed::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserQuestionCardTrashed::class,
        ],
        \App\Events\UserQuestionCardRecycled::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserQuestionCardRecycled::class,
        ],
        \App\Events\UserQuestionCardChanged::class => [
            LogModelEvent::class,
        ],

        \App\Events\UserAnswerCardDrawn::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserAnswerCardDrawn::class,
        ],
        \App\Events\UserAnswerCardPlayed::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserAnswerCardPlayed::class,
        ],
        \App\Events\UserAnswerCardTrashed::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserAnswerCardTrashed::class,
        ],
        \App\Events\UserAnswerCardRecycled::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserAnswerCardRecycled::class,
        ],
        \App\Events\UserAnswerCardRevealed::class => [
            LogModelEvent::class,
            \App\Listeners\HandleUserAnswerCardRevealed::class,
        ],
        \App\Events\UserAnswerCardChanged::class => [
            LogModelEvent::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
