<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnswerCard extends Model
{
    use HasFactory;

    protected $fillable = [ 'text', 'pack_id', 'migration_id' ]; 

    public function pack() : BelongsTo
    {
        return $this->belongsTo(\App\Models\Pack::class);
    }
}
