# Automatiser le front-end dans un projet Symfony2 ( Sans assetic )

### Bower & Gulp
Dans tout projet Web, nous sommes confrontés à plusieurs tâches répétitives.

Dans ce dépôt je propose donc de travailler simplement avec deux outils automatisant ces différentes tâches, Bower et Gulp.

Vous trouverez l'ensemble des fichiers de configuration nécessaire au bon fonctionnement de ces outils.

Une fois ces outils installés, pensez à supprimer Assetic de votre projet:

* Dans app/AppKernel.php, supprimer la ligne suivante :
```
new Symfony\Bundle\AsseticBundle\AsseticBundle(),
```

* Dans app/config.yml, supprimer la configuration assetic :
```
assetic:
    debug: "%kernel.debug%"
    use_controller: false
    bundles:        [ ]
    #java: /usr/bin/java
    filters:
        cssrewrite: ~
```

* Suivi du fichier app/config_dev.php :
```
assetic:
    use_controller: true
```