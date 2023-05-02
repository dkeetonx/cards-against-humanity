<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameDeckPack extends Model
{
    use HasFactory;

    protected $fillable = [ 'pack_id', 'game_room_id' ];

    public function gameRoom() : BelongsTo
    {
        return $this->belongsTo(\App\Models\GameRoom::class);
    }

    public function pack() : BelongsTo
    {
        return $this->belongsTo(\App\Models\Pack::class);
    }
}
