from os import name
from django.urls import path
from . import static_views
import pages.views as views

urlpatterns = [
    path('CFTS.cfm', views.frontend, name='index'),
    path('cfts.cfm', views.frontend, name='index'),
    path('', views.frontend, name='index'),
    path('consent', static_views.consent, name='consent'),
    path('howTo', static_views.howTo, name='howTo'),
    path('resources', static_views.resources, name='resources'),

    # resources
    path('resources/<str:file>', views.resources, name='resources'),

    # frontend
    path('frontend', views.frontend, name='frontend'),
    
    # user requests
    path('my-requests', views.userRequests, name='userRequests'),
    path('request/<uuid:id>', views.requestDetails, name='userRequests'),

    # queue
    path('queue', views.queue, name='queue'),
    path('transfer-request/<uuid:id>',
         views.transferRequest, name='transfer-request'),
    path('create-zip/<str:network_name>/<str:isCentcom>/<str:rejectPull>',
         views.createZip, name='create-zip'),
    path('getFile/uploads/<str:fileID>/<str:fileName>',
         views.getFile, name='getFile'),

    # scan
    path('scan/<str:pullZip>', views.scan, name="scan"),

    # pulls
    path('pulls', views.pulls, name='pulls'),
    path('getPull/<str:fileName>', views.getPull, name='getPull'),
    path('pulls-oneeye/<uuid:id>', views.pullsOneEye, name='pulls-oneeye'),
    path('pulls-twoeye/<uuid:id>', views.pullsTwoEye, name='pulls-twoeye'),
    path('pulls-done/<uuid:id>/<int:cd>', views.pullsDone, name='pulls-done'),
    path('cancelPull/<uuid:id>/', views.cancelPull, name='cancelPull'),

    # archive
    path('archive', views.archive, name='archive'),

    # reporting
    path('reports', views.reports, name='reports'),

    # feedback
    path('feedback', views.feedback, name='feedback'),
    path('submitfeedback', views.submitFeedback, name='submitfeedback'),
    
    # APIs
    path('api-getuser/<uuid:id>', views.getUser, name='api-getuser'),
    path('api-setreject', views.setReject, name='api-setreject'),
    path('api-unreject', views.unReject, name='api-unreject'),
    path('api-setencrypt', views.setEncrypt, name='api-setencrypt'),
    path('api-numbers', views.runNumbers, name='api-numbers'),
    path('api-processrequest', views.process, name='api-processrequest'),
    path('api-setconsentcookie', views.setConsentCookie, name='api-setconsentcookie'),
    path('api-getclassifications', views.getClassifications, name='api-getclassifications'),
    path('api-geteml/<str:emlName>', views.getEml, name='api-geteml'),
    path('api-removeCentcom/<uuid:id>', views.removeCentcom, name='api-removeCentcom'),
    path('api-requestnotes/<uuid:requestid>', views.requestNotes, name='api-requestnotes'),

    # dev tools
    path('tools-makefiles', views.makeFiles, name='make-files'),
    path('tools-stubget', views.stubGet, name='stub-get'),
    path('tools-stubpost', views.stubPost, name='stub-post'),
    path('tools-setupdb', views.setupDB, name="setupdb"),
]
