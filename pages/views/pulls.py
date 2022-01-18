# ====================================================================
# core
import datetime
from django.contrib import messages

# decorators
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.serializers import serialize
from django.views.decorators.cache import never_cache

# responses
from django.shortcuts import redirect, render
from django.http import JsonResponse, FileResponse  # , HttpResponse

# model/database stuff
from pages.models import *

# cfts settings
from cfts import settings

from pages.views.auth import superUserCheck, staffCheck
# ====================================================================


def getReviewers(pull):
    oneEyers = Request.objects.filter(pull=pull).values_list('files__user_oneeye__username', flat=True)
    twoEyers = Request.objects.filter(pull=pull).values_list('files__user_twoeye__username', flat=True)
    reviewers = list(oneEyers) + list(twoEyers)
    return set(reviewers)


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
@never_cache
def pulls(request):
    # request context
    rc = {
        'bodyText': 'This is the Pulls dashboard',
        'pull_history': []
    }

    networks = Network.objects.all()

    # get last 5 pull data for each network for current day and all past incomplete pulls
    for net in networks:
        # get information about the last pull that was done on each network
        pulls = Pull.objects.filter(network__name=net.name).filter(date_pulled__date=datetime.datetime.now().date()).order_by('-date_pulled')[:5]
        incompletePulls = Pull.objects.filter(network__name=net.name).filter(date_pulled__date__lt=datetime.datetime.now().date(), date_complete__isnull=True).order_by('-date_pulled')

        these_pulls = []
        for pull in pulls:
            reviewers = getReviewers(pull)

            this_pull = {
                'pull_id': pull.pull_id,
                'pull_number': pull.pull_number,
                'pull_date': pull.date_pulled,
                'pull_user': pull.user_pulled,
                'date_complete': pull.date_complete,
                'user_complete': pull.user_complete,
                'disk_number': pull.disc_number,
                'pull_network': net.name,
                'reviewers': reviewers,
            }
            these_pulls.append(this_pull)

        for pull in incompletePulls:
            reviewers = getReviewers(pull)

            this_pull = {
                'pull_id': pull.pull_id,
                'pull_number': pull.pull_number,
                'pull_date': pull.date_pulled,
                'pull_user': pull.user_pulled,
                'date_complete': pull.date_complete,
                'user_complete': pull.user_complete,
                'disk_number': pull.disc_number,
                'pull_network': net.name,
                'reviewers': reviewers,
            }
            these_pulls.append(this_pull)

        if len(these_pulls) > 0:
            rc['pull_history'].append(these_pulls)

    return render(request, 'pages/pulls.html', {'rc': rc})

# @login_required
# @user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
# def pullsOneEye( request, id ):
#   thisPull = Pull.objects.get( pull_id = id )
#   thisPull.date_oneeye = datetime.datetime.now()
#   thisPull.user_oneeye = request.user
#   thisPull.save()
#   return JsonResponse( { 'id': id } )

# @login_required
# @user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
# def pullsTwoEye( request, id ):
#   thisPull = Pull.objects.get( pull_id = id )
#   thisPull.date_twoeye = datetime.datetime.now()
#   thisPull.user_twoeye = request.user
#   thisPull.save()
#   return JsonResponse( { 'id': id } )


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
def pullsDone(request, id, cd):
    thisPull = Pull.objects.get(pull_id=id)
    thisPull.date_complete = datetime.datetime.now()
    thisPull.user_complete = request.user
    thisPull.disc_number = cd
    thisPull.save()
    messages.success(request, "Pull completed")
    return JsonResponse({'id': id})


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
def getPull(request, fileName):
    response = FileResponse(
        open(os.path.join(settings.PULLS_DIR, fileName), 'rb'))
    return response


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
def cancelPull(request, id):
    thisPull = Pull.objects.get(pull_id=id)
    files = File.objects.filter(pull=id)
    requests = Request.objects.filter(pull=id)

    files.update(pull=None)
    requests.update(pull=None)

    thisPull.delete()
    messages.success(request, "Pull canceled, requests returned to pending queue")
    return redirect('pulls')
