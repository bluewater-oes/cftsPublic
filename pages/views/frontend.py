# ====================================================================
# crypto
import hashlib
from django import http
# responses
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

# db/model stuff
from pages.models import *
# ====================================================================


@ensure_csrf_cookie
def frontend(request):
    nets = Network.objects.all()
    resources = ResourceLink.objects.all()
    try:
        cert = request.META['CERT_SUBJECT']
        
        if cert =="":
            rc = {'networks': nets, 'resources': resources, }
        else:
            userHash = hashlib.md5()
            userHash.update(cert.encode())
            userHash = userHash.hexdigest()
            rc = {'networks': nets, 'resources': resources,
                'cert': cert, 'userHash': userHash}

        return render(request, 'pages/frontend.html', {'rc': rc})
    
    except KeyError:
        return render(request, 'pages/consent.html')
