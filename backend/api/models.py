from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class Author(models.Model):
    au_id = models.AutoField(primary_key=True)
    author = models.CharField(max_length=50, db_index=True)
    year_born = models.SmallIntegerField()

    class Meta:
        indexes = [
            models.Index(fields=['author', 'year_born']),
        ]

    def __str__(self):
        return self.author


class Publishers(models.Model):
    pubid = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    company_name = models.CharField(max_length=255)
    address = models.CharField(max_length=50)
    city = models.CharField(max_length=20)
    state = models.CharField(max_length=10)
    zip = models.CharField(max_length=15)
    telephone = models.CharField(max_length=15)
    fax = models.CharField(max_length=15)
    comments = models.TextField()

    def __str__(self):
        return self.name


class Title(models.Model):
    title_id = models.AutoField(primary_key=True)
    isbn = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    year_published = models.SmallIntegerField()
    pubid = models.ForeignKey(Publishers, on_delete=models.CASCADE, related_name='titles')
    description = models.TextField()  
    notes = models.TextField(blank=True, null=True)  
    subject = models.CharField(max_length=100, default='Non catégorisé')  # Ajout d'une valeur par défaut
    comments = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    authors = models.ManyToManyField(Author, related_name='titles')

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['isbn']),
        ]

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email doit être renseignée.")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le super utilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le super utilisateur doit avoir is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='apiuser_groups',  # Ajout de related_name
        blank=True,
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='apiuser_permissions',  # Ajout de related_name
        blank=True,
        verbose_name='user permissions',
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    class Meta:
        indexes = [
            models.Index(fields=['email']),
        ]


class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    book = models.ForeignKey(Title, on_delete=models.CASCADE, related_name='reservations')
    reserved_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.book.title}"

    class Meta:
        indexes = [
            models.Index(fields=['user', 'book']),
            models.Index(fields=['reserved_at']),
        ]