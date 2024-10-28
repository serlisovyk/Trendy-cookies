import gulp from 'gulp'
import replace from 'gulp-replace'
import fileInclude from 'gulp-file-include'
import htmlclean from 'gulp-htmlclean'
import concat from 'gulp-concat'
import webpHTML from 'gulp-webp-retina-html'
import autoprefixer from 'gulp-autoprefixer'
import csso from 'gulp-csso'
import clean from 'gulp-clean'
import fs from 'fs'
import groupMedia from 'gulp-group-css-media-queries'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import changed from 'gulp-changed'
import imagemin from 'gulp-imagemin'
import svgsprite from 'gulp-svg-sprite'
import webp from 'gulp-webp'
import babel from 'gulp-babel'
import webpackStream from 'webpack-stream'
// import server from 'gulp-server-livereload'

gulp.task('clean:public', function (done) {
  if (fs.existsSync('./public/')) {
    return gulp.src('./public/', { read: false }).pipe(clean({ force: true }))
  }
  done()
})

const plumberNotify = title => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  }
}

gulp.task('html:public', function () {
  return gulp
    .src('./src/index.html')
    .pipe(changed('./public/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      replace(
        /(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(images|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        '$1./$4$5$7$1'
      )
    )
    .pipe(
      webpHTML({
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        retina: {
          1: '',
        },
      })
    )
    .pipe(htmlclean())
    .pipe(gulp.dest('./public/'))
})

gulp.task('css:public', function () {
  return gulp
    .src('./src/css/**/*.css')
    .pipe(changed('./public'))
    .pipe(plumber(plumberNotify('CSS')))
    .pipe(concat('style.css'))
    .pipe(autoprefixer())
    .pipe(groupMedia())
    .pipe(
      replace(
        /(['"]?)(\.\.\/)+(images|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
        '$1$2$3$4$6$1'
      )
    )
    .pipe(csso())
    .pipe(gulp.dest('./public'))
})

gulp.task('js:public', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./public'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpackStream(import('../webpack.config.js')))
    .pipe(gulp.dest('./public'))
})

gulp.task('fonts:public', function () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./public/fonts/'))
    .pipe(gulp.dest('./public/fonts/'))
})

gulp.task('images:public', function () {
  return gulp
    .src('./src/images/**/*')
    .pipe(changed('./public/images/'))
    .pipe(webp())
    .pipe(gulp.dest('./public/images/'))
    .pipe(gulp.src('./src/images/**/*'))
    .pipe(changed('./public/images/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./public/images/'))
})

gulp.task('svgStack:public', function () {
  return gulp
    .src('./src/images/svg/**/*.svg')
    .pipe(plumber(plumberNotify('SVG:dev')))
    .pipe(
      svgsprite({
        mode: {
          stack: {
            example: true,
          },
        },
      })
    )
    .pipe(gulp.dest('./public/images/svgsprite/'))
})

gulp.task('svgSymbol:public', function () {
  return gulp
    .src('./src/images/svg/**/*.svg')
    .pipe(plumber(plumberNotify('SVG:dev')))
    .pipe(
      svgsprite({
        mode: {
          symbol: {
            sprite: '../sprite.symbol.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: '(fill|stroke)',
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest('./public/images/svgsprite/'))
})

// gulp.task('server:public', function() {
//   return gulp.src('./public').pipe(server({ livereload: true, open: true }))
// })
