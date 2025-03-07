from app.models.auth_model import Admin
import bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, decode_token


def is_valid_refresh_token(refresh_token, user_email):
    try:
        decoded_token = decode_token(refresh_token)

        if decoded_token['sub'] != user_email:
            return False
        
        if decode_token.get('type') != 'refresh':
            return False
        
        return True
    
    except Exception as e:
        print( f"Token vslidation error: {str(e)}")
        return False

class AuthService:
    def __init__(self):
        pass


    def register_user(self, name, email, password):
        admin = Admin.query.filter_by(email=email).first()
        if admin:
            return {"status": "error", "message": "User already exists"}
        new_admin = Admin(name=name, email=email)
        new_admin.set_password(password)

        try:
            new_admin.save()
            return {"status": "success", "message": "User registered successfully, now Log in"}
        except Exception as e:
            return {"status": "error", "messags": str(e)}
        # return True


    def validate_user(self, email, password):
        admin = Admin.query.filter_by(email=email).first()
        # if not admin:
        #     return {"status": "error", "message": "User not found"}
        check_password = admin.check_password(password)
        if admin and check_password:
            return {
                "status": "success",
                "message": "Logged in successfully",
                "tokens": {
                    "access": create_access_token(identity=admin.email, additional_claims={"role": "admin"}),
                    "refresh": create_refresh_token(identity=admin.email)
                },
                "name": admin.name
            }
        else:
            return {"status": "error", "message": "Invalid email or password"}
        
    def refresh(self, current_user, password):
        try:
            admin = Admin.query.filter_by(email=current_user).first()
            if admin.check_password(password):
                new_access_token = create_access_token(identity=current_user, additional_claims={"role": "admin"})
                return {
                    "status": "success",
                    "message": "token refreshed",
                    "token": new_access_token
                }
            else:
                return {"status": "error", "message": "Invalid password"}
        except Exception as e:
            return {
                "status": "exception",
                "message": str(e)
            }

    def delete_user(self, email):
        admin = Admin.query.filter_by(email=email).first()
        if not admin:
            return {"status": "error", "message": "User doesn't exist"}

        try:
            admin.delete()
            return {"status": "success", "message": "User deleted successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        
    def check_profile(self, email):
        admin = Admin.query.filter_by(email=email).first()
        if not admin:
            return {"status": "error", "message": "User does not exist"}
        return {
            "status": "successful",
            "message": "Profile returned successfully",
            "profile": {
                "name": admin.name,
                "email": admin.email
            }
        }
    
    def update_general_profile(self, email, new_email, new_name):
        admin = Admin.query.filter_by(email=email).first()
        if admin:
            admin.email = new_email
            admin.name = new_name
            try:
                admin.save()

                if email != new_email:
                    new_token = create_access_token(identity=new_email)
                    return {
                        "status": "success", 
                        "message": "profile updated successfully", 
                        "new_token": new_token
                    }
                else:
                    return {
                        "status": "success", 
                        "message": "profile updated successfully",
                    }
            except Exception as e:
                return {
                    "status": "error",
                    "message": str(e)
                }
        return {
            "status": "error", 
            "message": "User not found"
        }
    
    def update_password(self, email, current_password, new_password):
        admin = Admin.query.filter_by(email=email).first()
        if admin:
            check_password = admin.check_password(current_password)
            if check_password:
                admin.set_password(new_password)
                try:
                    admin.save()
                    return {
                        "status": "success",
                        "message": "password updated successfully"
                    }
                except Exception as e:
                    return {
                        "status": "error",
                        "message": str(e)
                    }
            else:
                return {
                    "status": "error",
                    "message": "Current password is incorrect"
                }
        else:
            return {
                "status": "error",
                "message": "User not found"
            }
