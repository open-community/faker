/* eslint-disable import/no-extraneous-dependencies */
// ============================================================
// Import packages
const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');

const path = require('path');
const plumber = require('gulp-plumber');
const print = require('gulp-print').default;
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');

// ============================================================
// Module's constants and variables
const CACHE_FOLDER_PATH = './cache';
const DIST_FOLDER_PATH = './dist';
const DOC_FOLDER_PATH = './doc';
const REPORT_FOLDER_PATH = './reports';
const UNIT_TEST_FOLDER_PATH = path.resolve(REPORT_FOLDER_PATH, 'tests', 'unit');
const JAVASCRIPT_SOURCE_FILES = 'src/**/*.js';

// ============================================================
// Simple tasks

// ==============================
// Clean
gulp.task('clean:build', () => del([
    DIST_FOLDER_PATH,
]));

gulp.task('clean:cache', () => del([
    CACHE_FOLDER_PATH,
]));

gulp.task('clean:doc', () => del([
    DOC_FOLDER_PATH,
]));

gulp.task('clean:reports', () => del([
    REPORT_FOLDER_PATH,
]));

gulp.task('clean:report:tests:unit', () => del([
    UNIT_TEST_FOLDER_PATH,
]));

// ==============================
// Convert

gulp.task('convert:javascript', () => gulp.src(JAVASCRIPT_SOURCE_FILES)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist')));

gulp.task('convert:javascript:watch', () => watch(JAVASCRIPT_SOURCE_FILES, { ignoreInitial: false })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(print()));
// ============================================================
// Composed tasks
gulp.task(
    'build',
    gulp.series(
        'clean:build',
        'convert:javascript',
    ),
);

gulp.task(
    'build:watch',
    gulp.series(
        'clean:build',
        'convert:javascript:watch',
    ),
);

gulp.task('clean', gulp.parallel(
    'clean:build',
    'clean:cache',
    'clean:doc',
    'clean:reports',
));
