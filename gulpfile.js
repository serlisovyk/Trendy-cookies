import gulp from 'gulp'

import './gulp/dev.js'
import './gulp/public.js'

gulp.task(
  'default',
  gulp.series(
    'clean:dev',
    gulp.parallel(
      'html:dev',
      'css:dev',
      'images:dev',
      'fonts:dev',
      'js:dev',
      gulp.series('svgStack:dev', 'svgSymbol:dev')
    ),
    gulp.parallel('server:dev', 'watch:dev')
  )
)

gulp.task(
  'public',
  gulp.series(
    'clean:public',
    gulp.parallel(
      'html:public',
      'css:public',
      'images:public',
      'fonts:public',
      'js:public',
      gulp.series('svgStack:public', 'svgSymbol:public')
    )
    // ,
    // gulp.parallel('server:public')
  )
)
