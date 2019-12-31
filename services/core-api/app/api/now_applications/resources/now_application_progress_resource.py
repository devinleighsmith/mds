from flask import request
from app.extensions import api
from app.api.utils.access_decorators import requires_role_edit_permit
from app.api.now_applications.models.now_application import NOWApplication
from app.api.now_applications.models.now_application_progress import NOWApplicationProgress
from flask_restplus import Resource, reqparse
from app.api.utils.resources_mixins import UserMixin
from werkzeug.exceptions import BadRequest, NotFound, InternalServerError
from app.api.now_applications.response_models import NOW_APPLICATION_PROGRESS


class NOWApplicationProgressResource(Resource, UserMixin):
    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('application_progress_status_code', type=str, location='json')

    @api.doc(
        description=
        'Track progress of a Notice of Work application as it moves through its stages, track who progressed the application and when.'
    )
    @requires_role_edit_permit
    @api.marshal_with(NOW_APPLICATION_PROGRESS, code=200)
    def post(self, application_guid):
        data = self.parser.parse_args()
        application_progress_status_code = data.get('application_progress_status_code')
        application = NOWApplication.find_by_application_guid(application_guid)
        if not application:
            raise NotFound(
                'There was no notice of work application found with the provided application_guid.')
        if not application_progress_status_code:
            raise BadRequest('application_progress_status_code is required')
        now_progress = NOWApplicationProgress.create(application, application_progress_status_code)

        try:
            now_progress.save()
        except Exception as e:
            raise InternalServerError(f'Error when saving: {e}')

        return now_progress