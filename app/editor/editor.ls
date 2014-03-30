getNotes = (firepadRef)!->
  codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true })
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
        { richTextToolbar: true, richTextShortcuts: true })

window.Editor = angular.module("Editor", ['app.auth', 'firebase', 'ui.bootstrap'])
.controller 'EditorCtrl', ($scope, $ref, $trackConnected, $location, $firebase)->
  $scope.numUsers = 0
  $scope.info = {}
  noteid = $location.search!note
  noteRef = $ref.base.child("notes/#{noteid}")
  $scope.info.noteName = $firebase(noteRef.child('name'))
  getNotes(noteRef.child('firepad'))
  onlineRef = noteRef.child('online')
  $scope.$on 'loggedin', !->
    $trackConnected(onlineRef)
    $scope.users = $firebase(noteRef.child('online'))



