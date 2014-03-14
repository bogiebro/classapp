getNotes = (firepadRef)!->
  codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true })
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
        { richTextToolbar: true, richTextShortcuts: true })

window.Editor = angular.module("Editor", ['app.auth', 'firebase'])
.controller 'EditorCtrl', ($scope, $ref, $trackConnected, $location, $firebase)->
  $scope.numUsers = 0
  noteid = $location.search!note
  noteRef = $ref.base.child("notes/#{noteid}")
  getNotes(noteRef)
  onlineRef = noteRef.child('online')
  $scope.$on 'loggedin', !->
    $trackConnected(onlineRef)
    $scope.users = $firebase(noteRef.child('online'))



