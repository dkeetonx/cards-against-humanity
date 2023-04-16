<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'game_room_id',
        'status',
        'turn_index',
        'connected',
        'has_free_redraw',
        'points',
        'playing_status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $dispatchesEvents = [
        'updated' => \App\Events\UserUpdated::class,
    ];

    public function gameRoom() : BelongsTo
    {
        return $this->belongsTo(GameRoom::class);
    }

    public function leaveGameroom($save = false)
    {
        event(new \App\Events\UserLeftGame($this));
        $this->game_room_id = null;
        $this->turn_index = -1;
        $this->has_free_redraw = false;
        $this->points = 0;
        $this->playing_status = "waiting";
        if ($save)
        {
            $this->save();
        }
        return true;
    }
}
