import type { ApiSchemas } from '../../schema';
import { autoAssign, evaluatePlace } from '../domain/relocation-rules';
import { http } from '../http';
import { assign, getState, replaceState, unassign } from '../store';

type ManualRelocationRequest = ApiSchemas['ManualRelocationRequest'];

const error = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
) => ({ error: { code, message, ...(details ? { details } : {}) } });

export const relocationHandlers = [
  http.get('/relocations', ({ response }) =>
    response(200).json(getState().relocations),
  ),
  http.post('/relocations/auto-assign', ({ response }) => {
    const state = getState();
    const relocations = autoAssign(
      state.ghosts,
      state.places,
      state.relocations,
    );
    replaceState({ ...state, relocations });
    return response(200).json(relocations);
  }),
  http.put('/relocations/{ghostId}', async ({ params, request, response }) => {
    const body = (await request.json()) as ManualRelocationRequest;
    const state = getState();
    const ghost = state.ghosts.find(({ id }) => id === params.ghostId);
    if (!ghost)
      return response(404).json(error('NOT_FOUND', 'Заявка не найдена'));
    if (body.placeId === null) {
      unassign(ghost.id);
      return response(200).json({
        ghostId: ghost.id,
        placeId: null,
        mode: 'unassigned',
        score: null,
        issues: [],
      });
    }
    const place = state.places.find(({ id }) => id === body.placeId);
    if (!place)
      return response(404).json(error('NOT_FOUND', 'Место не найдено'));

    const occupied = state.relocations.filter(
      ({ placeId, ghostId }) => placeId === place.id && ghostId !== ghost.id,
    ).length;
    const evaluation = evaluatePlace(ghost, place, occupied);
    if (evaluation.score === null && !body.force) {
      return response(409).json(
        error(
          'RELOCATION_CONFLICT',
          'Выбранное место нарушает условия заявки',
          { issues: evaluation.issues },
        ),
      );
    }
    const relocation = {
      ghostId: ghost.id,
      placeId: place.id,
      mode: 'manual' as const,
      score: evaluation.score,
      issues: evaluation.issues,
    };
    assign(relocation);
    return response(200).json(relocation);
  }),
];
