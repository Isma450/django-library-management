from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth import password_validation
from .models import User

class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(
        label="Mot de passe",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
    )
    password2 = forms.CharField(
        label="Confirmation du mot de passe",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
    )

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        
        password_validation.validate_password(password1, self.instance)
        

        if len(password1) < 8:
            raise forms.ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
        if not any(char.isdigit() for char in password1):
            raise forms.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        if not any(char.isupper() for char in password1):
            raise forms.ValidationError("Le mot de passe doit contenir au moins une majuscule.")
        if not any(char.islower() for char in password1):
            raise forms.ValidationError("Le mot de passe doit contenir au moins une minuscule.")
        if not any(char in '!@#$%^&*()_+-=[]{}|;:,.<>?/' for char in password1):
            raise forms.ValidationError("Le mot de passe doit contenir au moins un caractère spécial.")
        
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Les mots de passe ne correspondent pas.")
        return password2