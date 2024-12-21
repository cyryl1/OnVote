from app.models import Admin
import bcrypt


class AuthService:
    def __init__():
        pass

    def register_user(name, email, password):
        admin = Admin.query.filter_by(email=email).first()
        if admin:
            return "exists"
        admin = Admin(name=name, email=email)
        admin.set_password(password)

        admin.save()
        return admin.id
        # return True


    def validate_user():
        pass

    def add_user():
        pass
