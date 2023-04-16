<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{anypath?}', [ GameController::class, 'home' ])->where('anypath', '(?!api).*');

Route::group(['prefix' => '/api/'], function () {
    Route::get('user', [ GameController::class, 'user' ]);
    Route::post('name', [ GameController::class, 'name' ]);
    Route::post('join', [ GameController::class, 'join' ]);
    Route::post('leave', [ GameController::class, 'leave' ]);
    Route::post('create', [ GameController::class, 'create' ]);

    Route::post('admit', [ GameController::class, 'admit' ])->middleware('owner');
    Route::post('deny', [ GameController::class, 'deny' ])->middleware('owner');
    
    Route::get('game', [ GameController::class, 'data']);
    Route::get('users', [ GameController::class, 'users']);
});
