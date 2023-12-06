class Trigger extends App.ControllerSubContent
  @requiredPermission: 'admin.trigger'
  header: __('Triggers')

  constructor: ->
    super

    @genericController = new Index(
      el: @el
      id: @id
      genericObject: 'Trigger'
      defaultSortBy: 'name'
      pageData:
        home: 'triggers'
        object: __('Trigger')
        objects: __('Triggers')
        pagerAjax: true
        pagerBaseUrl: '#manage/trigger/'
        pagerSelected: ( @page || 1 )
        pagerPerPage: 150
        navupdate: '#triggers'
        buttons: [
          { name: __('New Trigger'), 'data-type': 'new', class: 'btn--success' }
        ]
      container: @el.closest('.content')
      veryLarge: true
    )

  show: (params) =>
    for key, value of params
      if key isnt 'el' && key isnt 'shown' && key isnt 'match'
        @[key] = value

    @genericController.paginate( @page || 1 )

class Index extends App.ControllerGenericIndex
  newControllerClass: -> New
  editControllerClass: -> Edit

ActivatorMixin =
  events:
    'change select[name="activator"]': 'activatorChanged'

  contentFormModel: ->
    params = @contentFormParams()
    attrs = App[ @genericObject ].configure_attributes

    _.findWhere(attrs, { name: 'execution_condition_mode'}).hide = params.activator isnt 'action'
    _.findWhere(attrs, { name: 'condition'}).hasReached = params.activator is 'time'
    _.findWhere(attrs, { name: 'condition'}).action = params.activator is 'action'

    { configure_attributes: attrs }

  contentFormParams: ->
    @intermediaryParams || @item || { activator: 'action', execution_condition_mode: 'selective' }

  activatorChanged: (e) ->
    e.preventDefault()
    @intermediaryParams = App.ControllerForm.params(@el)
    @update()

class Edit extends App.ControllerGenericEdit
  @include ActivatorMixin

class New extends App.ControllerGenericNew
  @include ActivatorMixin

App.Config.set('Trigger', { prio: 3300, name: __('Trigger'), parent: '#manage', target: '#manage/trigger', controller: Trigger, permission: ['admin.trigger'] }, 'NavBarAdmin')
