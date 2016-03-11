# Automatiser le front-end dans un projet Symfony2 ( Sans Assetic )

### Bower & Gulp
Dans tout projet Web, nous sommes confrontés à plusieurs tâches répétitives.

Dans ce dépôt je propose donc de travailler simplement avec deux outils automatisant ces différentes tâches : Bower et Gulp.

Vous trouverez l'ensemble des fichiers de configuration nécessaire au bon fonctionnement de ces outils.

Une fois ces outils installés, pensez à supprimer Assetic de votre projet :

* Dans app/AppKernel.php, supprimez la ligne suivante :
```php
new Symfony\Bundle\AsseticBundle\AsseticBundle(),
```

* Dans app/config.yml, supprimez la configuration Assetic :
```yaml
assetic:
    debug: "%kernel.debug%"
    use_controller: false
    bundles:        [ ]
    #java: /usr/bin/java
    filters:
        cssrewrite: ~
```

* Suivi du fichier app/config_dev.php :
```yaml
assetic:
    use_controller: true
```

### Modules node utilisés

Voici une liste recensant l'ensemble des modules node utilisés :

* gulp 
* async
* gulp-load-plugins
* run-sequence
* del
* streamqueue
* gulp-filter
* gulp-bower
* gulp-concat
* gulp-changed
* gulp-ruby-sass
* gulp-autoprefixer
* gulp-iconfont
* gulp-consolidate
* gulp-uglify
* gulp-csso

Lancez la commande suivante pour installer l'ensemble :
```
npm install --save-dev gulp async gulp-load-plugins run-sequence del streamqueue gulp-filter gulp-bower gulp-concat gulp-changed gulp-ruby-sass gulp-autoprefixer gulp-iconfont gulp-consolidate gulp-uglify gulp-csso
```

ou ( avec le fichier package.json )

```
npm install
```
