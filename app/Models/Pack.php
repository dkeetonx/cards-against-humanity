<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [ 'name', 'official', 'q_count', 'a_count', 'migration_id' ];

    public function questionCards() : HasMany
    {
        return $this->hasMany(\App\Models\QuestionCard::class);
    }

    public function answerCards() : HasMany
    {
        return $this->hasMany(\App\Models\AnswerCard::class);
    }
}
