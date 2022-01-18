# ====================================================================
# core
from django.core import paginator
# decorators
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http.response import JsonResponse
from django.template.loader import render_to_string

# responses
from django.shortcuts import render

# model/database stuff
from pages.models import *
from pages.views.auth import superUserCheck, staffCheck

# ====================================================================


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
def archive(request):
    networks = Network.objects.all()
    requests = Request.objects.filter(pull__isnull=False)

    requestPage = paginator.Paginator(requests, 50)
    pageNum = request.GET.get('page')
    pageObj = requestPage.get_page(pageNum)

    rc = {'requests': pageObj, 'networks': networks}
    return render(request, 'pages/archive.html', {'rc': rc})


@login_required
@user_passes_test(staffCheck, login_url='frontend', redirect_field_name=None)
def filterArchive(request):
    networks = Network.objects.all()

    filters = dict(request.POST.lists())
    # print(filters)

    pullInfo = filters['pull'][0].split("_")

    try:
        if isinstance(int(pullInfo[0]), int):
            pullNum = pullInfo[0]
            networkName = ""
    except ValueError:
        try:
            networkName = pullInfo[0]
        except IndexError:
            networkName = ""

        try:
            pullNum = pullInfo[1]
        except IndexError:
            pullNum = ""

    requests = Request.objects.filter(pull__isnull=False)

    if filters['userFirst'][0] != "":
        requests = requests.filter(user__name_first__icontains=filters['userFirst'][0])

    if filters['userLast'][0] != "":
        requests = requests.filter(user__name_last__icontains=filters['userLast'][0])

    if filters['network'][0] != "":
        requests = requests.filter(network__name__icontains=filters['network'][0])

    if networkName != "":
        requests = requests.filter(pull__network__name__icontains=networkName)

    if pullNum != "":
        requests = requests.filter(pull__pull_number__icontains=pullNum)

    if filters['email'][0] != "":
        requests = requests.filter(target_email__address__icontains=filters['email'][0])

    if filters['org'][0] != "":
        requests = requests.filter(org__iexact=filters['org'][0])

    if filters['files'][0] != "":
        requests = requests.filter(files__file_name__icontains=filters['files'][0])

    if filters['date'][0] != "":
        requests = requests.filter(date_created__date=filters['date'][0])

    rc = {'requests': requests.distinct(), 'networks': networks}

    return render(request, 'partials/Archive_partials/archiveResults.html', {'rc': rc})
