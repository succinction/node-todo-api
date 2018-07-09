# from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from .models import Game
from django.views.decorators.csrf import csrf_exempt
import datetime
from accounts.models import User


@csrf_exempt
def leaderboard_api(request, thisuser, selected_user=None):
    if selected_user is None:
        selected_user = User.objects.all()[0].username
    your_stats = User.objects.get(username=thisuser)
    your_last_games = Game.objects.filter(user__username=selected_user).order_by('-id')[:10]
    best_games = Game.objects.all()[:10]
    selected_player_games = Game.objects.filter(user__username=selected_user)[:10]
    best_players = User.objects.all()[:20]
    your_best_games = Game.objects.filter(user__username=thisuser)[:10]
    Your_Stats = {'username': your_stats.username,
                  'rank': your_stats.rank,
                  'yourOverall': your_stats.overall_score,
                  'score': your_stats.score,
                  'bestScore': your_stats.best_score,
                  'wins': your_stats.wins,
                  'attempts': your_stats.attempts,
                  'currentStreak': your_stats.current_streak,
                  'bestStreak': your_stats.best_streak}

    data = {'yourStats': Your_Stats,
            'yourBestGames': [],
            'yourLastGames': [],
            'bestGames': [],
            'bestPlayers': [],
            'selectedPlayerGames': []}

    for game in your_best_games:
        data['yourBestGames'].append({
            'gameID': game.id,
            'finalTime': game.finalTime,
            'score': game.score,
            'gameType': game.gameType,
            'date': game.date,
        })

    for game in your_last_games:
        data['yourLastGames'].append({
            'gameID': game.id,
            'finalTime': game.finalTime,
            'score': game.score,
            'gameType': game.gameType,
            'date': game.date,
        })

    for game in best_games:
        data['bestGames'].append({
            'userName': game.user.username,
            'gameID': game.id,
            'finalTime': game.finalTime,
            'score': game.score,
            'gameType': game.gameType,
            'date': game.date,
        })

    for game in selected_player_games:
        data['selectedPlayerGames'].append({
            'userName': game.user.username,
            'gameID': game.id,
            'finalTime': game.finalTime,
            'score': game.score,
            'gameType': game.gameType,
            'date': game.date,
        })

    for player in best_players:
        data['bestPlayers'].append({
            'username': player.username,
            'overall': player.overall_score,
            'score': player.score,
            'bestScore': player.best_score,
            'wins': player.wins,
            'attempts': player.attempts,
            'currentStreak': player.current_streak,
            'bestStreak': player.best_streak
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
def game_list_api(request):
    games = Game.objects.all()[:20]
    data = []
    for game in games:
        data.append({
            'userName': game.user.username,
            'gameNumber': game.gameNumber,
            'date': game.date,
            'gameType': game.gameType,
            'numberOfMeasurements': game.numberOfMeasurements,
            'finalTime': game.finalTime,

        })
    return JsonResponse(data, safe=False)


@csrf_exempt
def game_api(request, id):
    game = Game.objects.get(id=id)
    data = {
        'id': game.id,
        'user': game.user.username,
        'gameNumber': game.gameNumber,
        'date': game.date,
        'gameType': game.gameType,
        'numberOfMeasurements': game.numberOfMeasurements,
        'finalTime': game.finalTime,
        'falseCoin': game.falseCoin,
        'measurements': game.measurements,
    }
    # json._default_encoder
    return JsonResponse(data, safe=False)


@csrf_exempt
def save_game_api(request):
    if request.method == 'POST':
        game = Game()
        user = User.objects.get(username=request.POST.get('userName', 'default'))
        if user.username == 'guest' or user.username == 'default':
            anaons = User.objects.filter(is_guest=True).latest('guest_number')
            next_guest = anaons.guest_number + 1
            user = User()
            user.username = f'Guest_{next_guest}'
            user.set_password('guest123')
            user.is_guest = True
            user.guest_number = next_guest
            user.save()
            login(request, user)
        #     authenticate
        game.user = user
        game.duration = request.POST.get('duration', 0)
        game.cheat = request.POST.get('cheat', False)
        game.gameNumber = int(request.POST.get('gameNumber', None))
        game.date = datetime.datetime.now()
        game.gameType = request.POST.get('gameType', None)
        game.numberOfMeasurements = request.POST.get('numberOfMeasurements', None)
        game.finalTime = request.POST.get('finalTime', None)
        game.falseCoin = request.POST.get('falseCoin', None)
        game.measurements = request.POST.get('measurements', None)

        # SCORE LOGIC
        gamewon = int(request.POST.get('won', 0))
        scoring = 0 if gamewon == 0 else round(int(game.gameType) / (1 + (int(game.duration) / 60)), 2)
        game.score = scoring
        game.save()
        if gamewon == 1:
            user.score = user.score + game.score
            user.best_score = game.score if game.score > user.best_score else user.best_score
        user.attempts += 1
        won = 1 if int(gamewon) == 1 else 0
        user.wins += won
        user.current_streak = user.current_streak + won if won == 1 else 0
        user.best_streak = user.current_streak if user.current_streak > user.best_streak else user.best_streak
        user.overall_score = round((
                    (user.best_streak + user.current_streak) / 2) + user.best_score + (user.score / user.attempts), 2)
        user.save()

        return JsonResponse({'message': 'success', 'newGuest': user.username, 'gameID': game.id})

    return JsonResponse({'message': 'fail'})