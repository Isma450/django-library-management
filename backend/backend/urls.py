from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from api.views import CreateUserView, CustomTokenObtainPairView, RefreshAccessTokenView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/user/register/", CreateUserView.as_view(), name="register"),
   path("api/v1/token/", CustomTokenObtainPairView.as_view(), name="get_token"),  # Custom view
    path("api/v1/token/refresh-access/", RefreshAccessTokenView.as_view(), name="refresh_access_token"),  # Custom view
    path("api/v1/auth/", include("rest_framework.urls")),  
    path("api/v1/", include("api.urls")), 
]

# # Configuration CORS pour le développement
# from django.conf import settings
# from django.conf.urls.static import static

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#     urlpatterns += [
#         path('__debug__/', include('debug_toolbar.urls')),
#     ]