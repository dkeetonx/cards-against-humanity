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
/*Route::get('/', [ GameController::class, 'home' ]);
Route::get('/create', [ GameController::class, 'home' ]);
Route::get('join', [ GameController::class, 'home' ]);
Route::get('join/{code}', [ GameController::class, 'home' ]);
*/
Route::group(['prefix' => '/api/'], function () {
    Route::get('user', [ GameController::class, 'user']);
    Route::post('name', [ GameController::class, 'name']);
    Route::post('join', [ GameController::class, 'join']);
    
    Route::get('game', [ GameController::class, 'data']);
    Route::get('users', [ GameController::class, 'users']);
});
