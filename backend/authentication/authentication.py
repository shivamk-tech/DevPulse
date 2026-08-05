from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):

        print(request.COOKIES)

        raw_token = request.COOKIES.get("access_token")

        if raw_token is None:
            return None

        validate_token = self.get_validated_token(raw_token)

        return self.get_user(validate_token), validate_token
